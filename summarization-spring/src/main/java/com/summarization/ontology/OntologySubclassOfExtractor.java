package com.summarization.ontology;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import com.hp.hpl.jena.ontology.ConversionException;
import com.hp.hpl.jena.ontology.OntClass;
import com.hp.hpl.jena.ontology.OntModel;
import com.hp.hpl.jena.ontology.OntModelSpec;
import com.hp.hpl.jena.ontology.OntResource;
import com.hp.hpl.jena.query.Query;
import com.hp.hpl.jena.query.QueryExecution;
import com.hp.hpl.jena.query.QueryExecutionFactory;
import com.hp.hpl.jena.query.QueryFactory;
import com.hp.hpl.jena.query.QuerySolution;
import com.hp.hpl.jena.query.ResultSet;
import com.hp.hpl.jena.rdf.model.ModelFactory;
import com.hp.hpl.jena.rdf.model.Resource;
import com.hp.hpl.jena.util.iterator.ExtendedIterator;
import com.hp.hpl.jena.vocabulary.RDFS;

/**
 * OntologySubclassOfExtractor: Extract SubClass of Concept and update the list of Concept
 */
public class OntologySubclassOfExtractor {
	
	private SubClassOf ConceptsSubclassOf = new SubClassOf();
	
	public void setConceptsSubclassOf(Concepts Concepts, OntModel ontologyModel){
		//Extract SubClassOf Relation
		Iterator<OntResource> IteratorExtractedConcepts = Concepts.getExtractedConcepts().iterator();
		
		List<OntResource> AddConcepts = new ArrayList<OntResource>();
		
		while(IteratorExtractedConcepts.hasNext()) {
			OntClass concept = (OntClass) IteratorExtractedConcepts.next();
			String URI = concept.getURI();
			
			if( URI!=null ){
				
				try{ //If Concept is Defined inside Ontology
					
					//Get List Of All Directed SuperClasses
					ExtendedIterator<OntClass> itSup = concept.listSuperClasses(true);
					
					while(itSup.hasNext()) {
						
						OntClass conceptSup = itSup.next();
						String URISUP = conceptSup.getURI();
						
						if( URISUP!=null ){
							
							//Save SubClassOf Relation (concept SubClassOf conceptSup)
							ConceptsSubclassOf.addSubClassOfRelation(concept, conceptSup);
							
							if(Concepts.getConcepts().get(URISUP) == null){ //If is a New Concept save It
								Concepts.getConcepts().put(URISUP,conceptSup.getLocalName());
								Concepts.setNewObtainedBy(URISUP, concept.getLocalName() + " - SubClassOf");
								AddConcepts.add(conceptSup);
							}
							
							//Count Presence of Class as SubClassOf (# Of Subclasses)
							Concepts.updateCounter(URISUP, "SubClassOf (# Of Subclasses)");
							//Count Presence of Class as SubClassOf (# Of Superclasses)
							Concepts.updateCounter(URI, "SubClassOf (# Of Superclasses)");
						}
						
					}
				}
				catch(ConversionException e){ //if Concept id Defined Outside Ontology
					
					//SPARQL Query for SubClasses
					String queryString = "PREFIX rdfs:<" + RDFS.getURI() + ">" +
										 "PREFIX ont:<" + concept.getNameSpace() + ">" + 
										 "SELECT ?obj " +
										 "WHERE {" +
										 "      ont:" + concept.getLocalName() + " rdfs:subClassOf ?obj" +
										 "      }";
					
					//Execute Query
					Query query = QueryFactory.create(queryString) ;
					QueryExecution qexec = QueryExecutionFactory.create(query, ontologyModel) ;
					
					try {
					    
						ResultSet results = qexec.execSelect();
					    
					    //Temporary Model in Order to Construct Node for External Concept
					    OntModel ontologyTempModel = ModelFactory.createOntologyModel(OntModelSpec.OWL_DL_MEM, null); 
					    
					    //Extract SubCallOf Relation
					    for ( ; results.hasNext() ; )
					    {
					      QuerySolution soln = results.nextSolution() ;

					      Resource obj = soln.getResource("obj");
					      String URIObj = obj.getURI();
					      
					      //Get SubClassOf all Class different from the current one
						  if( URIObj!=null && concept.getURI()!=URIObj ){
							  
							  OntClass conceptSup = ontologyTempModel.createClass(URIObj);
							  
							  //Save SubClassOf Relation (concept SubClassOf conceptSub)
							  ConceptsSubclassOf.addSubClassOfRelation(concept, conceptSup);
								
							  if(Concepts.getConcepts().get(URIObj) == null)  {//If is a New Concept save It
								  Concepts.getConcepts().put(URIObj,conceptSup.getLocalName());
								  Concepts.setNewObtainedBy(URIObj, concept.getLocalName() + " - SubClassOf");
								  AddConcepts.add(conceptSup);
							  }

							  //Count Presence of Class as SubClassOf (# Of Subclasses)
							  Concepts.updateCounter(URIObj, "SubClassOf (# Of Subclasses)");
							  //Count Presence of Class as SubClassOf (# Of Superclasses)
							  Concepts.updateCounter(URI, "SubClassOf (# Of Superclasses)");
						  }

					    }

					} finally { qexec.close() ; }
				}
				
			}
			
		}
		
		Concepts.getExtractedConcepts().addAll(AddConcepts);
	}
	
	public SubClassOf getConceptsSubclassOf(){
		return ConceptsSubclassOf;
	}

}
